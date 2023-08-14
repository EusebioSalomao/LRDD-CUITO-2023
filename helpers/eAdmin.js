//Para restringir acesso

export const eAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}
export const eSecret = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 2) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}
export const eSecretP = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 3) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}
export const eFinanc = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 4) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}

export const veryLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return next();
    /* req.flash('error_msg', 'Inicie sessão para aceder a área desejada!')
    res.redirect('/user/login') */
}
