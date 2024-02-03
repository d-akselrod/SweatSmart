using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;

namespace App_Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutPlanController : ControllerBase
    {
        private readonly DatabaseContext database;

        public WorkoutPlanController(DatabaseContext database)
        {
            this.database = database;
        }

        [Authorize]
        [HttpGet("{wid}/{eid}")]
        public async Task<ActionResult<WorkoutPlan>> GetWorkoutPlan(Guid wid, int eid)
        {
            var workoutPlan = await database.WorkoutPlans.FindAsync(wid, eid);

            if (workoutPlan == null)
            {
                return NotFound();
            }

            return Ok(workoutPlan);
        }
    }
}