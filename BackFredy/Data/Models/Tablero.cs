using System;
using System.Collections.Generic;

namespace Data.Models
{
    public partial class Tablero
    {
        public int Id { get; set; }
        public int IdPais { get; set; }
        public int IdDeportista { get; set; }
        public int IdModalidad { get; set; }
        public decimal TotalPeso { get; set; }

        public virtual Deportistum IdDeportistaNavigation { get; set; } = null!;
        public virtual Modalidad IdModalidadNavigation { get; set; } = null!;
        public virtual Pai IdPaisNavigation { get; set; } = null!;
    }
}
