using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;

namespace App_Service.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly DatabaseContext _context;

    public UserController(DatabaseContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost("/add-user")]
    public IActionResult AddUser()
    {
        var user = new User { Id = 1, Name = "John Doe" };
        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok();
    }

    [Authorize]
    [HttpGet("/get-user")]
    public IActionResult GetUsers()
    {
        var users = _context.Users.ToList();
        return Ok(users);

    }
}
