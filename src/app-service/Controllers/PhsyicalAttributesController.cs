using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace App_Service.Controllers;

[ApiController]
[Route("[controller]")]
public class PhysicalAttributesController : ControllerBase
{
    private readonly DatabaseContext database;

    public PhysicalAttributesController(DatabaseContext database)
    {
        this.database = database;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var physicalAttributes = await database.PhysicalAttributes.ToListAsync();
        return Ok(physicalAttributes);
    }
}