const pool = require('../config/database');

const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT 
            p.id_pedido,
            p.data,
            p.clientes_id_cliente,
            c.nome AS cliente_nome,
            (SELECT SUM(pp.quantidade * pp.valor) 
             FROM produtos_pedidos pp 
             WHERE pp.pedidos_id_pedido = p.id_pedido) AS total
        FROM pedidos p
        JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
        ORDER BY p.id_pedido
    `);
    return rows;
};

const findById = async (id) => {
    const [pedidoRows] = await pool.query(`
        SELECT p.*, c.nome AS cliente_nome
        FROM pedidos p
        JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
        WHERE p.id_pedido = ?
    `, [id]);

    if (pedidoRows.length === 0) return null;

    const pedido = pedidoRows[0];

    const [itensRows] = await pool.query(`
        SELECT 
            pp.produtos_id_produto,
            pp.quantidade,
            pp.valor,
            pr.nome AS produto_nome
        FROM produtos_pedidos pp
        JOIN produtos pr ON pp.produtos_id_produto = pr.id_produto
        WHERE pp.pedidos_id_pedido = ?
    `, [id]);

    pedido.itens = itensRows;
    return pedido;
};

const create = async (clientes_id_cliente, itens) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const dataAtual = new Date().toISOString().split('T')[0];
        const [pedidoResult] = await connection.query(
            'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
            [dataAtual, clientes_id_cliente]
        );
        const pedidoId = pedidoResult.insertId;

        for (const item of itens) {
            const [produtoRows] = await connection.query(
                'SELECT valor FROM produtos WHERE id_produto = ?',
                [item.produtos_id_produto]
            );
            if (produtoRows.length === 0) {
                throw new Error(`Produto ID ${item.produtos_id_produto} não encontrado`);
            }
            const valorUnitario = produtoRows[0].valor;

            await connection.query(
                `INSERT INTO produtos_pedidos 
                 (produtos_id_produto, pedidos_id_pedido, quantidade, valor) 
                 VALUES (?, ?, ?, ?)`,
                [item.produtos_id_produto, pedidoId, item.quantidade, valorUnitario]
            );
        }

        await connection.commit();
        return findById(pedidoId);

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const update = async (id, data, itens) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        if (data) {
            await connection.query(
                'UPDATE pedidos SET data = ? WHERE id_pedido = ?',
                [data, id]
            );
        }

        await connection.query(
            'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
            [id]
        );

        if (itens && itens.length > 0) {
            for (const item of itens) {
                const [produtoRows] = await connection.query(
                    'SELECT valor FROM produtos WHERE id_produto = ?',
                    [item.produtos_id_produto]
                );
                if (produtoRows.length === 0) {
                    throw new Error(`Produto ID ${item.produtos_id_produto} não encontrado`);
                }
                const valorUnitario = produtoRows[0].valor;

                await connection.query(
                    `INSERT INTO produtos_pedidos 
                     (produtos_id_produto, pedidos_id_pedido, quantidade, valor) 
                     VALUES (?, ?, ?, ?)`,
                    [item.produtos_id_produto, id, item.quantidade, valorUnitario]
                );
            }
        }

        await connection.commit();
        return findById(id);

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const remove = async (id) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query(
            'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
            [id]
        );
        await connection.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [id]
        );
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { findAll, findById, create, update, remove };