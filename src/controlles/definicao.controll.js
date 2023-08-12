
export const definicoes = async (req, res) => {
try {
    res.render('admin/definicoes')
} catch (error) {
    res.status(500).send({mesage: error.mesage})
}
}