using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App_Service.services;

public record Message(string role, string content);

[ApiController]
[Route("[controller]")]
public class ChatBot : ControllerBase
{
    private readonly string APIUrl = "https://api.openai.com/v1/chat/completions";
    private readonly string APIKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");

    private readonly Message systemMessage = new Message("system",
        "You are a fitness trainer assistant named \"Fit Bot\" here to answer any fitness/health related questions. " +
        "If you are given a prompt non-relating to fitness, you must respond stating that you can only answer fitness related questions.");

    public ChatBot()
    {
        if (APIKey != null) return;

        var keyVaultUrl = "https://sweatsmartdb-cs.vault.azure.net/";
        var client = new SecretClient(new Uri(keyVaultUrl), new ManagedIdentityCredential());
        APIKey = client.GetSecret("OpenAIAPIKey").Value.Value;
    }

    [Authorize]
    [HttpPost()]
    public async Task<IActionResult> GetResponse(Message[] history)
    {
        HttpClient httpClient = new HttpClient();

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", APIKey);

        var requestBody = new
        {
            messages = new Message[] { systemMessage }.Concat(history).ToArray(),
            model = "gpt-3.5-turbo",
            temperature = 0.4
        };

        var serializedBody = JsonSerializer.Serialize(requestBody);

        var response = await httpClient.PostAsync(APIUrl, new StringContent(serializedBody, Encoding.UTF8, "application/json"));

        if (response.IsSuccessStatusCode)
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            httpClient.Dispose();
            return Ok(responseBody);
        }
        else
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            httpClient.Dispose();
            return BadRequest(responseBody);
        }
    }
}