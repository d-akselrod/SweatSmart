using System.Collections;
using Microsoft.AspNetCore.Mvc;
using App_Service.Database;
using App_Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;


namespace App_Service.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkoutPlanController : ControllerBase
    {
        private readonly DatabaseContext database;

        public WorkoutPlanController(DatabaseContext database)
        {
            this.database = database;
        }

        [Authorize]
        [HttpGet("{wid}")]
        public async Task<IActionResult> GetWorkoutPlan(string wid)
        {
            Guid guidWid = Guid.Parse(wid);
            var workoutPlan = await database.WorkoutPlans.Where(workoutPlan => workoutPlan.WId == guidWid).ToListAsync();

            if (!workoutPlan.Any())
            {
                return APIResponse.NotFound;
            }

            return new APIResponse(200, null, workoutPlan);
        }
    }
}