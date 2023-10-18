using AutoMapper;
using Business.Interfaces;
using Common.Dto;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Classes
{
    public class TableroBusiness : ITableroBusiness
    {
        private bd_fredyContext db;
        private readonly IMapper mapper;

        public TableroBusiness(bd_fredyContext db, IMapper mapper)
        {
            this.db = db;
            this.mapper = mapper;
        }


        public List<TableroDTO> GetTablero()
        {
            var list = db.Tableros
                .Include(i => i.IdDeportistaNavigation)
                .Include(i => i.IdPaisNavigation)
                .Include(i => i.IdModalidadNavigation)
                .ToList();

            List<TableroDTO> tableroDTOs = this.mapper.Map<List<Tablero>, List<TableroDTO>>(list);

            return tableroDTOs;
        }
    }
}
