# Migration `20200721181459-agregando-restricción-de-unique-a-reclamo`

This migration has been generated by Andres Baldarrago at 7/21/2020, 6:14:59 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Credencial" ALTER COLUMN "rol" SET DEFAULT E'USUARIO';

CREATE UNIQUE INDEX "Reclamo.pedidoId_productoId" ON "public"."Reclamo"("pedidoId","productoId")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200721110458-agregando-monto-a-pedido..20200721181459-agregando-restricción-de-unique-a-reclamo
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
     provider = "postgresql"
-    url = "***"
+    url      = env("DATABASE_URL")
 }
 model Cargo {
     id       Int        @default(autoincrement()) @id
@@ -143,8 +143,9 @@
     detallePedido DetallePedido @relation(fields: [pedidoId, productoId], references: [pedidoId, productoId])
     pedidoId      Int
     productoId    Int
     motivo        String
+    @@unique([pedidoId, productoId])
 }
 model DetallePedido {
     pedido     Pedido    @relation(fields: [pedidoId], references: [id])
```


