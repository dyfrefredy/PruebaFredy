using Business.Interfaces;
using Common.Dto;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackFredy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TableroController : ControllerBase
    {
        ITableroBusiness _tableroBusiness;

        public TableroController(ITableroBusiness tableroBusiness)
        {
            _tableroBusiness = tableroBusiness;
        }


        // GET: api/<TableroController>
        [HttpGet]
        public IEnumerable<TableroDTO> Get()
        {
            return _tableroBusiness.GetTablero();
        }
    }
}
