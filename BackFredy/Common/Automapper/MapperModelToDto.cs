using AutoMapper;
using Common.Dto;
using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Automapper
{
    public class MapperModelToDto : Profile
    {
        public MapperModelToDto()
        {
            CreateMap<Tablero, TableroDTO>()
                .ForMember(x => x.IdDTO, y => y.MapFrom(z => z.Id))
                .ForMember(x => x.PaisDTO, y => y.MapFrom(z => z.IdPaisNavigation.Nombre))
                .ForMember(x => x.DeportistaDTO, y => y.MapFrom(z => z.IdDeportistaNavigation.Nombre))
                .ForMember(x => x.ModalidadDTO, y => y.MapFrom(z => z.IdModalidadNavigation.Descripcion))
                .ForMember(x => x.TotalPesoDTO, y => y.MapFrom(z => z.TotalPeso));
        }
    }
}
