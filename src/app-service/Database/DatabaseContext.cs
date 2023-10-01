using Microsoft.EntityFrameworkCore;
using App_Service.Models;

namespace App_Service.Database;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
}