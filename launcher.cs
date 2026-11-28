using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Management;
using System.Net;
using System.Reflection;
using System.Threading;

internal static class Launcher
{
    private const string ProductName = "Coalition Builder - Party Chair";
    private const int DefaultPort = 48182;

    private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { ".html", "text/html; charset=utf-8" },
        { ".htm", "text/html; charset=utf-8" },
        { ".js", "application/javascript; charset=utf-8" },
        { ".cjs", "application/javascript; charset=utf-8" },
        { ".css", "text/css; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".svg", "image/svg+xml" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".gif", "image/gif" },
        { ".ico", "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2", "font/woff2" },
        { ".csv", "text/csv; charset=utf-8" },
        { ".txt", "text/plain; charset=utf-8" }
    };

    [STAThread]
    private static void Main()
    {
        HttpListener listener = null;
        try
        {
            string appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string installDir = Path.Combine(appData, ProductName);
            Directory.CreateDirectory(installDir);
            ExtractGame(installDir);

            string indexPath = Path.Combine(installDir, "index.html");
            string launchUrl = new Uri(indexPath).AbsoluteUri;

            // Serve over a stable loopback HTTP origin so Edge/Chromium grants full IndexedDB quota
            // (hundreds of MB to GB) and navigator.storage.persist() instead of file:// 5MB limits.
            int boundPort;
            listener = StartLocalServer(installDir, out boundPort);
            if (listener != null)
            {
                launchUrl = "http://127.0.0.1:" + boundPort + "/index.html";
            }

            string edge = FindEdge();
            if (edge == null)
            {
                Process.Start(new ProcessStartInfo(listener != null ? launchUrl : indexPath) { UseShellExecute = true });
                if (listener != null)
                    Thread.Sleep(TimeSpan.FromHours(12));
                return;
            }

            string profile = Path.Combine(installDir, "BrowserProfile");
            Directory.CreateDirectory(profile);
            Process browser = Process.Start(new ProcessStartInfo
            {
                FileName = edge,
                Arguments = "--app=\"" + launchUrl + "\" --user-data-dir=\"" + profile + "\" --no-first-run --disable-background-mode",
                WindowStyle = ProcessWindowStyle.Maximized,
                UseShellExecute = false
            });

            if (browser != null)
            {
                DateTime launchedAt = DateTime.UtcNow;
                browser.WaitForExit();
                // If Edge already had a process open for BrowserProfile, the new msedge.exe
                // hands off the URL and exits immediately; keep the local HTTP server alive
                // only while an msedge.exe process for this game's BrowserProfile is running.
                if (listener != null && (DateTime.UtcNow - launchedAt).TotalSeconds < 10)
                {
                    DateTime deadline = DateTime.UtcNow.AddHours(12);
                    while (DateTime.UtcNow < deadline && IsGameBrowserProfileRunning(profile))
                        Thread.Sleep(2000);
                }
            }
        }
        catch (Exception ex)
        {
            try
            {
                string logPath = Path.Combine(Path.GetTempPath(), "CoalitionBuilderPartyChair-error.txt");
                File.WriteAllText(logPath, ex.ToString());
                Process.Start(new ProcessStartInfo("notepad.exe", "\"" + logPath + "\"") { UseShellExecute = true });
            }
            catch { }
        }
        finally
        {
            if (listener != null)
            {
                try { listener.Stop(); listener.Close(); } catch { }
            }
        }
    }

    private static HttpListener StartLocalServer(string rootDir, out int boundPort)
    {
        boundPort = 0;
        if (!HttpListener.IsSupported)
            return null;

        string fullRoot = Path.GetFullPath(rootDir);
        if (!fullRoot.EndsWith(Path.DirectorySeparatorChar.ToString()))
            fullRoot += Path.DirectorySeparatorChar;

        for (int port = DefaultPort; port < DefaultPort + 12; port++)
        {
            HttpListener candidate = new HttpListener();
            try
            {
                candidate.Prefixes.Add("http://127.0.0.1:" + port + "/");
                candidate.Start();
                boundPort = port;

                Thread serverThread = new Thread(() => ServeLoop(candidate, fullRoot))
                {
                    IsBackground = true
                };
                serverThread.Start();
                return candidate;
            }
            catch
            {
                try { candidate.Close(); } catch { }
            }
        }
        return null;
    }

    private static void ServeLoop(HttpListener listener, string fullRoot)
    {
        while (listener.IsListening)
        {
            HttpListenerContext ctx;
            try
            {
                ctx = listener.GetContext();
            }
            catch
            {
                break;
            }

            ThreadPool.QueueUserWorkItem(_ => HandleRequest(ctx, fullRoot));
        }
    }

    private static void HandleRequest(HttpListenerContext ctx, string fullRoot)
    {
        try
        {
            string rawPath = Uri.UnescapeDataString(ctx.Request.Url.AbsolutePath ?? "/");
            if (string.IsNullOrEmpty(rawPath) || rawPath == "/")
                rawPath = "/index.html";

            string relPath = rawPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            string fullPath = Path.GetFullPath(Path.Combine(fullRoot, relPath));

            if (!fullPath.StartsWith(fullRoot, StringComparison.OrdinalIgnoreCase) || !File.Exists(fullPath))
            {
                ctx.Response.StatusCode = 404;
                ctx.Response.Close();
                return;
            }

            string ext = Path.GetExtension(fullPath);
            string mime;
            ctx.Response.ContentType = MimeTypes.TryGetValue(ext, out mime) ? mime : "application/octet-stream";
            ctx.Response.Headers["Cache-Control"] = "no-cache";

            byte[] bytes = File.ReadAllBytes(fullPath);
            ctx.Response.ContentLength64 = bytes.Length;
            ctx.Response.OutputStream.Write(bytes, 0, bytes.Length);
            ctx.Response.OutputStream.Close();
        }
        catch
        {
            try { ctx.Response.StatusCode = 500; ctx.Response.Close(); } catch { }
        }
    }

    private static void ExtractGame(string installDir)
    {
        using (Stream resource = Assembly.GetExecutingAssembly().GetManifestResourceStream("CoalitionBuilder.Payload"))
        using (ZipArchive archive = new ZipArchive(resource, ZipArchiveMode.Read))
        {
            string root = Path.GetFullPath(installDir) + Path.DirectorySeparatorChar;
            foreach (ZipArchiveEntry entry in archive.Entries)
            {
                string target = Path.GetFullPath(Path.Combine(installDir, entry.FullName));
                if (!target.StartsWith(root, StringComparison.OrdinalIgnoreCase))
                    throw new InvalidDataException("The packaged game contains an invalid path.");

                if (String.IsNullOrEmpty(entry.Name))
                {
                    Directory.CreateDirectory(target);
                    continue;
                }

                Directory.CreateDirectory(Path.GetDirectoryName(target));
                using (Stream input = entry.Open())
                using (FileStream output = new FileStream(target, FileMode.Create, FileAccess.Write, FileShare.None))
                    input.CopyTo(output);
            }
        }
    }

    private static bool IsGameBrowserProfileRunning(string profileDir)
    {
        try
        {
            using (var searcher = new ManagementObjectSearcher("SELECT CommandLine FROM Win32_Process WHERE Name = 'msedge.exe'"))
            using (var results = searcher.Get())
            {
                foreach (ManagementObject obj in results)
                {
                    string cmd = obj["CommandLine"] as string;
                    if (!string.IsNullOrEmpty(cmd) && cmd.IndexOf(profileDir, StringComparison.OrdinalIgnoreCase) >= 0)
                        return true;
                }
            }
        }
        catch { }
        return false;
    }

    private static string FindEdge()
    {
        string programFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
        string programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
        string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string[] candidates =
        {
            Path.Combine(programFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
            Path.Combine(programFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
            Path.Combine(localAppData, "Microsoft", "Edge", "Application", "msedge.exe")
        };
        return candidates.FirstOrDefault(File.Exists);
    }
}
