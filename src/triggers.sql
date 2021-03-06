CREATE OR REPLACE FUNCTION fn_tg_dar_baja_cargo() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Personal" SET "estado" = FALSE WHERE "cargoId" = NEW."id";
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_dar_baja_personal() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Credencial" SET "estado" = FALSE WHERE "personalId" = NEW."id";
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_registrar_pago() RETURNS TRIGGER AS
$$
DECLARE
	mesaId INT;
BEGIN
	SELECT "mesaId" INTO mesaId FROM "Pedido" WHERE "id" = NEW."pedidoId";
	UPDATE "Pedido" SET "estado" = FALSE WHERE "id" = NEW."pedidoId";
	UPDATE "Mesa" SET "ocupado" = FALSE WHERE "id" = mesaId;
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_eliminar_pago() RETURNS TRIGGER AS
$$
DECLARE
	mesaId INT;
BEGIN
	SELECT "mesaId" INTO mesaId FROM "Pedido" WHERE "id" = OLD."pedidoId";
	UPDATE "Pedido" SET "estado" = FALSE WHERE "id" = OLD."pedidoId";
	UPDATE "Mesa" SET "ocupado" = FALSE WHERE "id" = mesaId;
	RETURN OLD;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_registrar_pedido() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Mesa" SET "ocupado" = TRUE WHERE "id" = NEW."mesaId";
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_registrar_detalle_pedido() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Producto" SET "cantidad" = "cantidad" - NEW."cantidad" WHERE "id" = NEW."productoId";
	UPDATE "Pedido" SET "monto" = "monto" + (NEW."precio" * NEW."cantidad") WHERE "id" = NEW."pedidoId";
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_registrar_insumo_producto() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Producto" SET "cantidad" = "cantidad" + NEW."cantidad" WHERE "id" = NEW."productoId";
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_registrar_reclamo() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "DetallePedido" SET "estado" = FALSE WHERE "pedidoId" = NEW."pedidoId" AND "productoId" = NEW."productoId";
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_modificar_reclamo() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "DetallePedido" SET "estado" = TRUE WHERE "pedidoId" = OLD."pedidoId" AND "productoId" = OLD."productoId";
	UPDATE "DetallePedido" SET "estado" = FALSE WHERE "pedidoId" = NEW."pedidoId" AND "productoId" = NEW."productoId";
	RETURN NEW;

END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_eliminar_reclamo() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "DetallePedido" SET "estado" = TRUE WHERE "pedidoId" = OLD."pedidoId" AND "productoId" = OLD."productoId";
	RETURN OLD;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_dar_baja_tipo_producto() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Producto" SET "estado" = FALSE WHERE "tipoProductoId" = NEW."id";
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tg_dar_baja_cargo BEFORE UPDATE ON "Cargo" FOR EACH ROW WHEN (NEW."estado" = FALSE) EXECUTE PROCEDURE fn_tg_dar_baja_cargo();
CREATE TRIGGER tg_dar_baja_personal BEFORE UPDATE ON "Personal" FOR EACH ROW WHEN (NEW."estado" = FALSE) EXECUTE PROCEDURE fn_tg_dar_baja_personal();
CREATE TRIGGER tg_registrar_pago AFTER INSERT ON "Pago" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_pago();
CREATE TRIGGER tg_eliminar_pago AFTER DELETE ON "Pago" FOR EACH ROW EXECUTE PROCEDURE fn_tg_eliminar_pago();
CREATE TRIGGER tg_registrar_pedido AFTER INSERT ON "Pedido" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_pedido();
CREATE TRIGGER tg_registrar_detalle_pedido AFTER INSERT ON "DetallePedido" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_detalle_pedido();
CREATE TRIGGER tg_registrar_insumo_producto AFTER INSERT ON "InsumoProducto" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_insumo_producto();
CREATE TRIGGER tg_registrar_reclamo AFTER INSERT ON "Reclamo" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_reclamo();
CREATE TRIGGER tg_modificar_reclamo BEFORE UPDATE ON "Reclamo" FOR EACH ROW WHEN (OLD."productoId" IS DISTINCT FROM NEW."productoId") EXECUTE PROCEDURE fn_tg_modificar_reclamo();
CREATE TRIGGER tg_eliminar_reclamo AFTER DELETE ON "Reclamo" FOR EACH ROW EXECUTE PROCEDURE fn_tg_eliminar_reclamo();
CREATE TRIGGER tg_dar_baja_tipo_producto BEFORE UPDATE ON "TipoProducto" FOR EACH ROW WHEN (NEW."estado" = FALSE) EXECUTE PROCEDURE fn_tg_dar_baja_tipo_producto();