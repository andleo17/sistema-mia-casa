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

CREATE TRIGGER tg_registrar_pedido AFTER INSERT ON "Pedido" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_pedido();
CREATE TRIGGER tg_registrar_detalle_pedido AFTER INSERT ON "DetallePedido" FOR EACH ROW EXECUTE PROCEDURE fn_tg_registrar_detalle_pedido();