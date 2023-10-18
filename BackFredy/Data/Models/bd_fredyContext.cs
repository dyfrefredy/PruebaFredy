using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Data.Models
{
    public partial class bd_fredyContext : DbContext
    {
        public bd_fredyContext()
        {
        }

        public bd_fredyContext(DbContextOptions<bd_fredyContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Deportistum> Deportista { get; set; } = null!;
        public virtual DbSet<Modalidad> Modalidads { get; set; } = null!;
        public virtual DbSet<Pai> Pais { get; set; } = null!;
        public virtual DbSet<Tablero> Tableros { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Deportistum>(entity =>
            {
                entity.Property(e => e.Apellido)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Nombre)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Modalidad>(entity =>
            {
                entity.ToTable("Modalidad");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Pai>(entity =>
            {
                entity.Property(e => e.Nombre).HasMaxLength(50);
            });

            modelBuilder.Entity<Tablero>(entity =>
            {
                entity.ToTable("Tablero");

                entity.Property(e => e.TotalPeso).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.IdDeportistaNavigation)
                    .WithMany(p => p.Tableros)
                    .HasForeignKey(d => d.IdDeportista)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Tablero_Deportista");

                entity.HasOne(d => d.IdModalidadNavigation)
                    .WithMany(p => p.Tableros)
                    .HasForeignKey(d => d.IdModalidad)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Tablero_Modalidad");

                entity.HasOne(d => d.IdPaisNavigation)
                    .WithMany(p => p.Tableros)
                    .HasForeignKey(d => d.IdPais)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Tablero_Pais");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
