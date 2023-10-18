using Common.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Interfaces
{
    public interface ITableroBusiness
    {
        List<TableroDTO> GetTablero();
    }
}
