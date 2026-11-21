using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;

internal class Program
{
    private const string DefaultModel = "gemma4:12b";

    private static void Main(string[] args)
    {
        Console.Title = "Gemma 4 Launcher";
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("==================================================");
        Console.WriteLine("              Gemma 4 Local Launcher              ");
        Console.WriteLine("==================================================");
        Console.ResetColor();

        string model = args.Length > 0 ? args[0] : DefaultModel;

        string ollamaPath = FindOllamaPath();
        if (string.IsNullOrEmpty(ollamaPath) || !File.Exists(ollamaPath))
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("\n[ERROR] Ollama executable was not found.");
            Console.WriteLine("Please ensure Ollama is installed in your local AppData folder or added to PATH.");
            Console.ResetColor();
            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey(true);
            return;
        }

        Console.WriteLine("\n[1/2] Checking Ollama service status...");
        EnsureOllamaServiceRunning(ollamaPath);

        Console.WriteLine("[2/2] Starting interactive session with model: " + model);
        Console.WriteLine("--------------------------------------------------");
        Console.ForegroundColor = ConsoleColor.DarkGray;
        Console.WriteLine("Tip: Type '/bye' to end the session at any time.\n");
        Console.ResetColor();

        try
        {
            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = ollamaPath,
                Arguments = "run " + model,
                UseShellExecute = false
            };

            using (Process process = Process.Start(psi))
            {
                if (process != null)
                {
                    process.WaitForExit();
                }
            }
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("\n[ERROR] Failed to run Ollama: " + ex.Message);
            Console.ResetColor();
        }

        Console.WriteLine("\n==================================================");
        Console.WriteLine("Session closed. Press any key to exit...");
        Console.ReadKey(true);
    }

    private static string FindOllamaPath()
    {
        string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string defaultPath = Path.Combine(localAppData, "Programs", "Ollama", "ollama.exe");
        if (File.Exists(defaultPath))
        {
            return defaultPath;
        }

        string programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
        string pfPath = Path.Combine(programFiles, "Ollama", "ollama.exe");
        if (File.Exists(pfPath))
        {
            return pfPath;
        }

        string pathEnv = Environment.GetEnvironmentVariable("PATH") ?? "";
        string[] paths = pathEnv.Split(';');
        foreach (string dir in paths)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dir)) continue;
                string fullPath = Path.Combine(dir.Trim(), "ollama.exe");
                if (File.Exists(fullPath))
                {
                    return fullPath;
                }
            }
            catch { }
        }

        return null;
    }

    private static void EnsureOllamaServiceRunning(string ollamaPath)
    {
        if (IsServerAlive())
        {
            Console.WriteLine(" -> Ollama server is already active.");
            return;
        }

        Console.WriteLine(" -> Ollama server is not running. Starting background service...");

        string dir = Path.GetDirectoryName(ollamaPath);
        string appPath = Path.Combine(dir, "ollama app.exe");

        ProcessStartInfo startInfo;
        if (File.Exists(appPath))
        {
            startInfo = new ProcessStartInfo
            {
                FileName = appPath,
                UseShellExecute = true
            };
        }
        else
        {
            startInfo = new ProcessStartInfo
            {
                FileName = ollamaPath,
                Arguments = "serve",
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden,
                UseShellExecute = false
            };
        }

        try
        {
            Process.Start(startInfo);
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(" -> Could not start background service automatically: " + ex.Message);
            Console.ResetColor();
        }

        // Wait up to 10 seconds for the server to become ready
        for (int i = 0; i < 20; i++)
        {
            Thread.Sleep(500);
            if (IsServerAlive())
            {
                Console.WriteLine(" -> Ollama server is ready.");
                return;
            }
        }

        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine(" -> Note: Server response check timed out, attempting to run model anyway...");
        Console.ResetColor();
    }

    private static bool IsServerAlive()
    {
        try
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:11434/api/tags");
            request.Timeout = 1000;
            request.Method = "GET";
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                return response.StatusCode == HttpStatusCode.OK;
            }
        }
        catch
        {
            return false;
        }
    }
}
