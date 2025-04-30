using System;
using AutoMapper;
using MiniTaskHub.Api.Mappings;
using MiniTaskHub.Api.Models;
using MiniTaskHub.Api.Models.Enums;

namespace MiniTaskHub.Tests;

public class MappingProfileTests
{
    private readonly IMapper _mapper;
    public MappingProfileTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public void TaskDto_Maps_To_TaskItem()
    {
        // Arrange
        var dto = new TaskDto
        {
            Title = "Test",
            Description = "Testing AutoMapper",
            Status = TaskItemStatus.InProgress,
            DueDate = DateTime.Today
        };

        // Act
        var entity = _mapper.Map<TaskItem>(dto);

        // Assert
        Assert.Equal(dto.Title, entity.Title);
        Assert.Equal(dto.Description, entity.Description);
        Assert.Equal(dto.Status, entity.Status);
        Assert.Equal(dto.DueDate, entity.DueDate);
    }

    [Fact]
    public void TaskItem_Maps_To_TaskDto()
    {
        // Arrange
        var entity = new TaskItem
        {
            Title = "Test",
            Description = "Testing AutoMapper",
            Status = TaskItemStatus.InProgress,
            DueDate = DateTime.Today
        };

        // Act
        var dto = _mapper.Map<TaskDto>(entity);

        // Assert
        Assert.Equal(entity.Title, dto.Title);
        Assert.Equal(entity.Description, dto.Description);
        Assert.Equal(entity.Status, dto.Status);
        Assert.Equal(entity.DueDate, dto.DueDate);
    }
}

