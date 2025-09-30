using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Infrastructure.Data;
using MiniTaskHub.Core.Models;
using MiniTaskHub.Core.Models.Enums;
using MiniTaskHub.Infrastructure.Services;

namespace MiniTaskHub.Tests;
public class TasksServiceTests
{
    [Fact]
    public async Task CreateTaskAsync_AddsTaskToDatabase()
    {
        // Arrange: Use in-memory database
        var options = new DbContextOptionsBuilder<TaskHubDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_CreateTask")
            .Options;

        using var context = new TaskHubDbContext(options);
        var service = new TaskService(context);

        var newTask = new TaskItem
        {
            Title = "Test Task",
            Description = "Test Description",
            Status = TaskItemStatus.Pending,
            DueDate = DateTime.Now.AddDays(1)
        };

        // Act
        var createdTask = await service.CreateTaskAsync(newTask, "test-user-id");

        // Assert
        Assert.NotNull(createdTask);
        Assert.Equal("Test Task", createdTask.Title);
        // Verify that the task was added to the database
        Assert.Single(context.Tasks, t => t.Id == createdTask.Id);
    }
}