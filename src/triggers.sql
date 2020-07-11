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

CREATE OR REPLACE FUNCTION fn_tg_registrar_pedido() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Mesa" SET ocupado = TRUE WHERE id = new.mesaId;
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_tg_registrar_detalle_pedido() RETURNS TRIGGER AS
$$
BEGIN
	UPDATE "Producto" SET cantidad = cantidad - new.cantidad WHERE id = new.productoId;
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tg_dar_baja_cargo BEFORE UPDATE ON "Cargo" FOR EACH ROW WHEN (NEW."estado" = FALSE) EXECUTE PROCEDURE fn_tg_dar_baja_cargo();
CREATE TRIGGER tg_dar_baja_personal BEFORE UPDATE ON "Personal" FOR EACH ROW WHEN (NEW."estado" = FALSE) EXECUTE PROCEDURE fn_tg_dar_baja_personal();
CREATE TRIGGER tg_registrar_pedido AFTER INSERT ON "Pedido" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_pedido();
CREATE TRIGGER tg_registrar_detalle_pedido AFTER INSERT ON "DetallePedido" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_detalle_pedido();