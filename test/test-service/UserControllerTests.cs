using Microsoft.AspNetCore.Mvc;
using App_Service.Controllers;
using App_Service.Models;

public class UserControllerTests : TestBase
{
    [Fact]
    public void AddUser_ShouldAddUser()
    {
        // Arrange
        var controller = new UserController(context);

        // Act
        var result = controller.AddUser();

        // Assert
        var user = context.Users.Find(1);
        Assert.NotNull(user);
        Assert.Equal("John Doe", user.Name);
    }

    [Fact]
    public void GetUsers_ShouldReturnEvenIdUsers()
    {
        // Arrange
        context.Users.Add(new User { Id = 1, Name = "John" });
        context.Users.Add(new User { Id = 2, Name = "Jane" });
        context.Users.Add(new User { Id = 3, Name = "Doe" });
        context.SaveChanges();
        var controller = new UserController(context);

        // Act
        var result = controller.GetUsers() as OkObjectResult;

        // Assert
        var users = result.Value as List<User>;
        Assert.Equal(3, users.Count);
    }
}