using Application.Features.Homeowners.Commands;
using Application.Features.Homeowners.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeownersController : ControllerBase
{
    private readonly IMediator _mediator;

    public HomeownersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<HomeownerDto>>> GetAll()
    {
        var homeowners = await _mediator.Send(new GetAllHomeownersQuery());
        return Ok(homeowners);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HomeownerDto>> GetById(Guid id)
    {
        var homeowner = await _mediator.Send(new GetHomeownerByIdQuery(id));
        
        if (homeowner == null)
            return NotFound();

        return Ok(homeowner);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateHomeownerCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateHomeownerCommand command)
    {
        if (id != command.Id)
            return BadRequest("Id mismatch");

        var result = await _mediator.Send(command);
        
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteHomeownerCommand(id));
        
        if (!result)
            return NotFound();

        return NoContent();
    }
}

