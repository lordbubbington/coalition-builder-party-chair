using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;

internal static class Launcher
{
    private const string ProductName = "Coalition Builder - Party Chair";

    [STAThread]
    private static void Main()
    {
        try
        {
            string appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string installDir = Path.Combine(appData, ProductName);
            Directory.CreateDirectory(installDir);
            ExtractGame(installDir);

            string indexPath = Path.Combine(installDir, "index.html");
            string edge = FindEdge();
            if (edge == null)
            {
                Process.Start(new ProcessStartInfo(indexPath) { UseShellExecute = true });
                return;
            }

            string profile = Path.Combine(installDir, "BrowserProfile");
            Directory.CreateDirectory(profile);
            string fileUrl = new Uri(indexPath).AbsoluteUri;
            Process browser = Process.Start(new ProcessStartInfo
            {
                FileName = edge,
                Arguments = "--app=\"" + fileUrl + "\" --user-data-dir=\"" + profile + "\" --no-first-run",
                WindowStyle = ProcessWindowStyle.Maximized,
                UseShellExecute = false
            });

            if (browser != null)
                browser.WaitForExit();
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
