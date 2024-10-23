import db from "../server.js";
import validator from 'validator'; 

export const register = async (req, res, next) => {
    const { formDataWithInterests } = req.body;

    if (!formDataWithInterests) {
        return next(createError(400, "Form data is missing"));
    }

    const { name, lastName, gitlabId, kaggleId, gender, dateofbirth, bio, interests } = formDataWithInterests;

    if (!name || !lastName || !gitlabId || !kaggleId) {
        return res.status(400).json("Please fill all required fields!");
    }

    const cleanName = validator.escape(name);  // Αφαιρεί επικίνδυνα σύμβολα
    const cleanLastName = validator.escape(lastName);
    const cleanBio = bio ? validator.escape(bio) : null;
    
    const validGenders = ['male', 'female', 'non-binary', 'other'];
    if (gender && !validGenders.includes(gender)) {
        return res.status(400).json("Invalid gender value!");
    }

    const genderValue = gender === '' ? null : gender;
    const DateOfBirthValue = dateofbirth && dateofbirth !== '' ? validator.escape(dateofbirth) : null;

    try {
        const isGitlabValid = await validateGitlabId(gitlabId);
        if (!isGitlabValid) {
            return res.status(400).json("Invalid GitLab ID!");
        }
        const isKaggleValid = await validateKaggleId(kaggleId);
        if (!isKaggleValid) {
            return res.status(400).json("Invalid Kaggle ID!");
        }

        const userExists = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM regist WHERE gitlabId = ? OR kaggleId = ?', [gitlabId, kaggleId], (err, rows) => {
                if (err) {
                    console.error("Database query failed: ", err.stack);
                    return res.status(500).json("Database query error");
                }
                resolve(rows);
            });
        });

        if (userExists.length > 0) {
            return res.status(400).json("A user with this data has already registered!");
        }

        let Interests = Array.isArray(interests) ? interests.join(',') : interests;

        const newUser = {
            name: cleanName,        
            lastName: cleanLastName,
            gitlabId,
            kaggleId,
            gender: genderValue, 
            dateofbirth: DateOfBirthValue,
            bio: cleanBio,          
            interest: Interests
        };

        await new Promise((resolve, reject) => {
            db.query('INSERT INTO regist SET ?', newUser, (err, result) => {
                if (err) {
                    console.error("Database insert failed: ", err.stack);
                    return res.status(500).json("Database insert error");
                }
                resolve(result);
            });
        });

        res.status(200).json({
            message: "You successfully registered!"
        });

    } catch (error) {
        console.error("Unexpected server error: ", error);
        return res.status(500).json("Server error");
    }
};

const validateGitlabId = async (gitlabId) => {
    try {
        const response = await fetch(`https://gitlab.com/${gitlabId}`);

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error validating GitLab ID: ", error);
        return false; 
    }
};

const validateKaggleId = async (kaggleId) => {
    try {
        const response = await fetch(`https://www.kaggle.com/${kaggleId}`);
        
        return response.status === 200;
    } catch (error) {
        console.error("Error validating Kaggle ID: ", error);
        return false; 
    }
};


export const getAllColumnsFromRegist = async (req, res, next) => {
    try {
        db.query('SELECT * FROM regist', (err, results) => {
            if (err) {
                return next(err); 
            }

            res.status(200).json(results); 
        });
    } catch (err) {
        next(err);
    }
}
