using System;
using AutoMapper;
using MiniTaskHub.Core.Models;

namespace MiniTaskHub.Api.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Map TaskItem <-> TaskDto both ways
        CreateMap<TaskItem, TaskDto>().ReverseMap();
    }
}
