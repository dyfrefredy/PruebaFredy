using System;
using System.Collections.Generic;

namespace Data.Models
{
    public partial class Modalidad
    {
        public Modalidad()
        {
            Tableros = new HashSet<Tablero>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; } = null!;
        public bool Estado { get; set; }

        public virtual ICollection<Tablero> Tableros { get; set; }
    }
}
