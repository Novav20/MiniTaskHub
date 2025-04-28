using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniTaskHub.Api.Controllers;
using MiniTaskHub.Api.Models;
using MiniTaskHub.Api.Models.Enums;
using MiniTaskHub.Api.Services;
using Moq;

namespace MiniTaskHub.Tests;

public class TasksControllerTests
{
    [Fact]
    public async Task CreateTask_InvalidModel_ReturnsBadRequest()
    {
        // Arrange
        var mockService = new Mock<ITaskService>(); // Mock the ITaskService
        var controller = new TasksController(mockService.Object);

        // Simulate invalid model state (e.g. missing title)
        controller.ModelState.AddModelError("Title", "Required");

        var taskDto = new TaskDto
        {
            // Title is missing
            Description = "Test",
            Status = TaskItemStatus.Pending,
            DueDate = DateTime.Now.AddDays(1)
        };

        // Act
        var result = await controller.CreateTask(taskDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }
}