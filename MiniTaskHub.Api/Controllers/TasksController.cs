using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Core.DTOs;
using MiniTaskHub.Core.Models;
using MiniTaskHub.Core.Services;
using System.Security.Claims;

namespace MiniTaskHub.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController(ITaskService taskService, IMapper mapper, UserManager<ApplicationUser> userManager) : ControllerBase
    {
        private readonly ITaskService _taskService = taskService;
        private readonly IMapper _mapper = mapper;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        private string GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) throw new InvalidOperationException("User ID not found in token.");
            return userId;
        }

        /// <summary>
        /// Retrieves all tasks from the database.
        /// </summary>
        /// <returns>
        /// HTTP 200 OK with the list of tasks if successful,
        /// or HTTP 500 Internal Server Error if an exception occurs.
        /// </returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTasks()
        {
            var userId = GetCurrentUserId();
            var tasks = await _taskService.GetAllTasksAsync(userId);
            return Ok(tasks);
        }

        /// <summary>
        /// Retrieves a task by its ID.
        /// </summary>
        /// <param name="id">The ID of the task to retrieve.</param>
        /// <returns>
        /// HTTP 200 OK with the task if found,
        /// 404 Not Found if the task does not exist,
        /// or 500 Internal Server Error if an exception occurs.
        /// </returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTask(int id)
        {
            var userId = GetCurrentUserId();
            //TODO: consider a separate TaskResponseDto instead of TaskItem to decouple API and services
            var task = await _taskService.GetTaskByIdAsync(id, userId);
            if (task is null) return NotFound(new ErrorResponse { Message = $"Task with id {id} not found or not accesible." });
            return Ok(task);
        }

        /// <summary>
        /// Creates a new task.
        /// </summary>
        /// <param name="taskDto">The task data submitted in the request body.</param>
        /// <returns>
        /// HTTP 201 Created with the created task,
        /// 400 Bad Request if input is invalid,
        /// or 500 Internal Server Error if an exception occurs.
        /// </returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateTask([FromBody] TaskDto taskDto)
        {
            if (taskDto == null)
                return BadRequest(new ErrorResponse { Message = "Task data cannot be null." });
            if (!ModelState.IsValid)
                return BadRequest(new ErrorResponse { Message = "Validation failed.", Details = ModelState.ToString() });
            var userId = GetCurrentUserId();
            var task = _mapper.Map<TaskItem>(taskDto);
            var createdTask = await _taskService.CreateTaskAsync(task, userId);
            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }

        /// <summary>
        /// Updates an existing task.
        /// </summary>
        /// <param name="id">The ID of the task to update.</param>
        /// <param name="taskDto">The updated task data.</param>
        /// <returns>
        /// HTTP 200 OK with the updated task,
        /// 400 Bad Request if input is invalid,
        /// 404 Not Found if the task does not exist,
        /// or 500 Internal Server Error if an exception occurs.
        /// </returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskDto taskDto)
        {
            if (taskDto == null)
                return BadRequest(new ErrorResponse { Message = "Task data cannot be null." });
            if (!ModelState.IsValid)
                return BadRequest(new ErrorResponse { Message = "Validation failed.", Details = ModelState.ToString() });

            var userId = GetCurrentUserId();
            var task = _mapper.Map<TaskItem>(taskDto);
            var updatedTask = await _taskService.UpdateTaskAsync(id, task, userId);
            if (updatedTask is null) return NotFound(new ErrorResponse { Message = $"Task with id {id} not found or not accesible." });
            return Ok(updatedTask);
        }

        /// <summary>
        /// Deletes a task by its ID.
        /// </summary>
        /// <param name="id">The ID of the task to delete.</param>
        /// <returns>
        /// HTTP 204 No Content if deletion is successful,
        /// 404 Not Found if the task does not exist,
        /// 409 Conflict if the task was modified concurrently,
        /// or 500 Internal Server Error if an exception occurs.
        /// </returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetCurrentUserId();
            var task = await _taskService.GetTaskByIdAsync(id, userId);
            if (task is null) return NotFound(new ErrorResponse { Message = $"Task with id {id} not found or not accesible." });

            try
            {
                await _taskService.DeleteTaskAsync(id, userId);
                return NoContent(); // Successfully deleted
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new ErrorResponse { Message = "The task was modified or deleted by another user." });
            }
        }

    }
}
