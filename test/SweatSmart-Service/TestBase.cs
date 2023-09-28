using Microsoft.EntityFrameworkCore;
using SweatSmart_Service.Database;

public class TestBase : IDisposable
{
    protected readonly SweatSmartDbContext context;

    protected TestBase()
    {
        var options = new DbContextOptionsBuilder<SweatSmartDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        context = new SweatSmartDbContext(options);
        context.Database.EnsureCreated();
    }

    public void Dispose()
    {
        context.Database.EnsureDeleted();
        context.Dispose();
    }
}