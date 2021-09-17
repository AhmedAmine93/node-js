const bcrypt = require("bcryptjs");
const utilisateur = require("../data-base/utilisateur");
exports.inscription = (req, res) => {
    console.log(req.body);
    let pos_a = req.body.email.indexOf("@");
    if (pos_a != -1) {
        let user = new utilisateur(req.body);
        // criptage mote de page
        bcrypt.genSalt(10, (cle_error, cle) => {
            if (cle) {
                bcrypt.hash(req.body.mot_de_passe, cle, (hash_error, hash) => {
                    if (hash) {
                        user.mot_de_passe = hash;
                        user.save((err, saved) => {
                            if (err) {
                                res.send(err.message);
                            } else {
                                return saved;
                            }
                        });
                        return res.render("../views/pagePrincipale.html.twig");
                    } else {
                        console.log("hash_error" + hash_error);
                    }
                });
            } else {
                console.log("cle_error" + cle_error);
            }
        });
    } else {
        return res.send("emai bad format");
    }
};
exports.login = (req, res) => {
    utilisateur.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.send("mail invalid");
        } else {
            bcrypt.compare(
                req.body.mot_de_passe,
                user.mot_de_passe,
                (err, success) => {
                    if (success) {
                        return res.send("ok");
                    } else {
                        return res.send("mot de passe invalide");
                    }
                }
            );
        }
    });
};