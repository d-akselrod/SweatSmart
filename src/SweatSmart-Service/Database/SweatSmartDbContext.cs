using Microsoft.EntityFrameworkCore;
using SweatSmart_Service.Models;

namespace SweatSmart_Service.Database;

public class SweatSmartDbContext : DbContext
{
    public SweatSmartDbContext(DbContextOptions<SweatSmartDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
}