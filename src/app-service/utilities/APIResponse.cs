using Microsoft.AspNetCore.Mvc;

public class APIResponseObject
{
    public int Code { get; set; }
    public string Message { get; set; }
    public object Body { get; set; }

    public APIResponseObject(int code, string message = null, object body = null)
    {
        Code = code;
        Message = message;
        Body = body;
    }
}

public class APIResponse : IActionResult
{
    private readonly APIResponseObject response;

    public static readonly APIResponse Ok = new APIResponse(200, null, null);
    public static readonly APIResponse BadRequest = new APIResponse(400, "Bad request", null);
    public static readonly APIResponse Unauthorized = new APIResponse(401, "Unauthorized", null);
    public static readonly APIResponse NotFound = new APIResponse(404, "Not found", null);
    public static readonly APIResponse Conflict = new APIResponse(409, "Conflict", null);

    public APIResponse(int code, string? message, object? body)
    {
        response = new APIResponseObject(code, message, body);
    }

    public Task ExecuteResultAsync(ActionContext context)
    {
        var result = new ObjectResult(response)
        {
            StatusCode = response.Code
        };
        return result.ExecuteResultAsync(context);
    }
}
