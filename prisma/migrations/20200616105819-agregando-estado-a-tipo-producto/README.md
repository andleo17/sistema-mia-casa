# Migration `20200616105819-agregando-estado-a-tipo-producto`

This migration has been generated by Andres Baldarrago at 6/16/2020, 10:58:19 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."TipoProducto" ADD COLUMN "estado" boolean  NOT NULL DEFAULT true;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200615183747-arreglando-algunas-columnas--producto-y-detalle-compra..20200616105819-agregando-estado-a-tipo-producto
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 model Cargo {
   id       Int        @default(autoincrement()) @id
@@ -67,8 +67,9 @@
 model TipoProducto {
   id        Int        @default(autoincrement()) @id
   nombre    String     @unique
+  estado    Boolean    @default(true)
   productos Producto[]
 }
 model Producto {
```


