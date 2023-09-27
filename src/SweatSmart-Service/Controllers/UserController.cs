using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweatSmart_Service.Database;
using SweatSmart_Service.Models;

namespace SweatSmart_Service.Controllers;

public class UserController : ControllerBase
{
    private readonly SweatSmartDbContext _context;

    public UserController(SweatSmartDbContext context)
    {
        _context = context;
    }

    [HttpPost("/add-user")]
    public IActionResult AddUser()
    {
        var user = new User { Id = 2, Name = "John Bass" };
        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok();
    }

    [HttpGet("/get-user")]
    public IActionResult GetUsers()
    {
        int num = 1;
        //var evenIdUsers = _context.Users.FromSqlRaw("SELECT * FROM Users WHERE Id % " + num + " = 0").ToList();
        var users = _context.Users.ToList();
        return Ok(users);

    }
}
