require("dotenv").config();
const pool = require("./db");
//ler a chave da api-
const API_KEY = process.env.API_KEY_SECRET;
let limitReq = 0;
//função que vai fazer a validação da chave da api que está no arquivo .env
// function autenticarApiKey(req, res, next){
//     // variavel da api que vem do front-end
//     const API_KEY_FRONT= req.header('minha-chave');

//     if(API_KEY_FRONT === API_KEY && limitReq <=3){
//         //se cair dentro desse if a chave do front é valida
//         console.log("chave é valida", API_KEY_FRONT, API_KEY);
//         //chamar o next quando a chave for valida
//         limitReq = limitReq + 1
//         if(limitReq > 3){
//             return
//         }
//         console.log(limitReq);
//         next();
//     }else{
//         //se cair no else a chave não é valida
//         console.log("chave invalida", API_KEY_FRONT);
//         return res.status(500).json({mensagem: "CHAVE INVALIDA DA API"});
//     }
// }

async function autenticarApiKey(req, res, next) {
    const API_KEY_FRONT = req.header("minha-chave");
    const result = await pool.query(
        `select * from public.api_keys where api_key ilike $1;`,
        [API_KEY_FRONT]
    );
    console.table(result.rows[0])
    const hoje = new Date().toISOString().split("T")[0];
    console.log(hoje);
    let ultima_data = result.rows[0].criado_em;
    let formatarUltima_data = new Date(ultima_data).toISOString().split("T")[0];
    console.log(formatarUltima_data);
    let novoConsumo = 1;
    if (formatarUltima_data !== hoje) {
        pool.query(
            `update public.api_keys set criado_em = $1,consumo = $2 where api_key ilike $3`,
            [hoje, novoConsumo, API_KEY_FRONT]

        );
        
    }
    if (result.rows[0].consumo >= result.rows[0].limite) {
        console.log("accesso negado");
        return;
    }
    if (result.rows.length == 1) {
        let consumo1 = result.rows[0].consumo;
        consumo1 = consumo1 + 1;
        const consumo = await pool.query(
            `update public.api_keys set consumo = $1 where api_key ilike $2 RETURNING *`,
            [consumo1, API_KEY_FRONT]
        );
        next();
    } else {
        console.log("chave invalida", API_KEY_FRONT);
        return res.status(500).json({ mensagem: "CHAVE INVALIDA DA API" });
    }
}

// limitarRequest()
module.exports = autenticarApiKey;
