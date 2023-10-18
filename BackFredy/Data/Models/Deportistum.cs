using System;
using System.Collections.Generic;

namespace Data.Models
{
    public partial class Deportistum
    {
        public Deportistum()
        {
            Tableros = new HashSet<Tablero>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public bool Estado { get; set; }

        public virtual ICollection<Tablero> Tableros { get; set; }
    }
}
