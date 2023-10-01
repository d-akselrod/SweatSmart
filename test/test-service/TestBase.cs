using Microsoft.EntityFrameworkCore;
using App_Service.Database;

public class TestBase : IDisposable
{
    protected readonly DatabaseContext context;

    protected TestBase()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        context = new DatabaseContext(options);
        context.Database.EnsureCreated();
    }

    public void Dispose()
    {
        context.Database.EnsureDeleted();
        context.Dispose();
    }
}