using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using App_Service.Database;
using App_Service.Models;

namespace App_Service.Controllers;

public class UserController : ControllerBase
{
    private readonly DatabaseContext _context;

    public UserController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpPost("/add-user")]
    public IActionResult AddUser()
    {
        var user = new User { Id = 1, Name = "John Doe" };
        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok();
    }

    [HttpGet("/get-user")]
    public IActionResult GetUsers()
    {
        var users = _context.Users.ToList();
        return Ok(users);

    }
}
