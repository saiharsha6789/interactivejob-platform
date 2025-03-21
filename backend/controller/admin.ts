
import { param } from 'express-validator';
import { body } from 'express-validator';
import { Router } from "express";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
const router = Router();
const multer = require('multer')
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from "express";
const company = require('../model/company')
const apply = require('../model/apply')
const jobs = require('../model/intern')
const profile = require('../model/profile')
const intern = require('../model/intern')
const admin = require('../model/Admin')
const adminintern = require('../model/adminapplication')
const { validate, adminvalidation, userid, id } = require('../validations/admin')



// Temporary store for OTP (use a database in production)
// Define the type of otpStore as an object where the keys are email addresses (strings) and the values are OTPs (strings)
let otpStore: { [email: string]: string } = {};

// Set up email transporter (use your own SMTP service provider like Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 587 if using TLS
    secure: true, // true for 465, false for 587
    auth: {
        user: 'cse.takeoff@gmail.com',
        pass: 'digkagfgyxcjltup', // Replace with the App Password
    },
});


// Generate OTP function
function generateOTP(): string {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generates a 6-digit OTP
    return otp.toString();
}


// Admin default login with OTP
router.post('/login', validate(adminvalidation), async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (email === "lovelypurnash1430@gmail.com" && password === "admin") {
            // Generate OTP and store it
            const otp = generateOTP();
            otpStore[email] = otp;  // Store OTP temporarily (use DB in production)
            console.log(otp);
            

            // Send OTP email
          const mailOptions = {
    from: '"Admin" <cse.takeoff@gmail.com>', // Ensure it's the authenticated email
    to: email,
    subject: 'Your OTP Code for Login',
    text: `Your OTP code is: ${otp}`,
};

            // Send OTP via email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to send OTP',
                        error
                    });
                }


                // Inform user to check email
                return res.status(200).json({
                    success: true,
                    message: 'Login successful. OTP sent to your email for verification.',
                });
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Incorrect email or password",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// OTP verification route
router.post('/verify-otp', async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        const storedOtp = otpStore[email];

        if (storedOtp === otp) {
            // OTP is correct, login successful
            delete otpStore[email]; // Clear OTP after successful verification
            res.status(200).json({
                success: true,
                message: 'OTP verified successfully. Login complete.',
            });
        } else {
            // OTP is incorrect
            res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});



//get all company
router.get('/company', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companys = await company.find();
        if (companys) {
            res.status(200).json({
                success: true,
                companys
            })
        } else {
            res.status(404).json({
                success: false,
                message: "no company found"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})


//get single company by id
router.get('/company/:id', validate(id), async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const companys = await company.findById(id);
        if (companys) {
            res.status(200).json({
                success: true,
                companys
            })
        } else {
            res.status(404).json({
                success: false,
                message: "no company found in this id"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})



//get the all register profile
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await profile.find()
        if (users) {
            res.status(200).json({
                success: true,
                users
            })
        } else {
            res.status(404).json({
                success: false,
                message: "no data found"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})


//get the one user by is id
router.get('/user/:id', validate(userid), async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    try {
        const user = await profile.findOne({ user: userId })
        if (user) {
            res.status(200).json({
                success: true,
                Student: user
            })
        } else {
            res.status(404).json({
                success: false,
                message: "no data found"
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})


//get the all internship from company
router.get('/intern', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interns = await intern.find();
        if (interns) {
            res.status(200).json({
                success: true,
                interns
            })
        } else {
            res.status(404).json({
                success: false,
                message: "no intern found"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})


//admin  approve
router.post('/admin/:internids', async (req: Request, res: Response, next: NextFunction) => {
    const internIds = req.params.internids;

    try {
        // Find the internship with the specified internid
        const internship = await intern.findById(internIds);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "No internship found for this id",
            });
        }

        const update = await intern.findByIdAndUpdate(internIds, { status: true });
        if (update) {
            res.status(200).json({
                success: true,
                message: "admin accepted",
                update

            })
        } else {
            // await intern.findByIdAndUpdate(internIds,{status:false});
            res.status(400).json({
                success: false,
                message: "admin not accepted"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});





//reject the internship
// router.put('/reject/:id',async(req:Request,res:Response,next:NextFunction)=>{
//     const id = req.params.id;
//     try{
//         const interns = await intern.findById(id);
//         if(!interns){
//             res.status(404).json({
//                 success:false,
//                 message:"no intern found this id"
//             })
//         }else{
//             const {status} = req.body
//             const update = await intern.findByIdAndUpdate(id,{status:status})
//             if(update){
//                 res.status(200).json({
//                     success:true,
//                     mesage:"rejected by admin"

//                 })
//             }else{
//                 res.status(400).json({
//                     success:false,
//                     message:"some want roung try again"
//                 })
//             }
//         }

//     }catch(error){
//         console.log(error)
//         res.status(500).json({
//             success:false,
//             message:"internal server error"
//         })
//     }
// })


//admin can get all jobs in student posted
router.get('/admin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobs = await admin.find();
        if (jobs) {
            res.status(200).json({
                success: true,
                jobs

            })
        } else {
            res.status(404).json({
                success: false,
                message: "no jobs found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})


//admin can get all jobs by company id
router.get('/admin/:companyid', async (req: Request, res: Response, next: NextFunction) => {
    const companyid = req.params.companyid
    try {
        const jobs = await admin.findOne({ company: companyid });
        if (jobs) {
            res.status(200).json({
                success: true,
                jobs

            })
        } else {
            res.status(404).json({
                success: false,
                message: "no jobs found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})


//admin get the internshp by id

router.get('/admin/:internid', async (req: Request, res: Response, next: NextFunction) => {
    const internid = req.params.internid;

    try {
        const jobs = await admin.find({ intern: internid });

        if (jobs.length > 0) {
            res.status(200).json({
                success: true,
                jobs
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No jobs found for this internid"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});




//get the total internship with company id
router.get('/intern/:id', async (req: Request, res: Response, NextFunction: NextFunction) => {
    const companyid = req.params.id;
    try {
        const companys = await company.findById(companyid);
        if (!companys) {
            res.status(404).json({
                success: false,
                message: "data not found"
            })
        }
        const userprofile = await intern.findOne({ company: companyid })
        if (userprofile) {
            res.status(200).json({
                success: true,
                job: userprofile
            })
        } else {
            res.status(404).json({
                success: false,
                message: "data not found"
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })

    }
})



//section - d application






const store = multer.diskStorage({
    destination: "applications",
    filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const resumes = multer({ storage: store });





//admin get all aplicationsforms
router.get('/applications', async (req: any, res: Response, next: NextFunction) => {
    try {
        const applications = await apply.find();

        // Use filter to find applications with status 'processing'
        const fresh = applications.filter((item: any) => item.status === false);

        if (fresh.length > 0) {
            res.status(200).json({
                success: true,
                applications: fresh
            });
        } else {
            res.status(200).json({
                success: false,
                message: "No fresh applications"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});




//get the change status all applyctionform
router.post('/applications/:userid/:internid', async (req: any, res: any, next: NextFunction) => {
    const { userid, internid } = req.params; // Remove .userid from req.params.userid
    try {
        // Find applications for the specified user
        const userApplications = await apply.find({ user: userid, intern: internid });


        const id = await userApplications.map((item: any) => {
            return item._id
        })



        if (!userApplications || userApplications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No applications found for this user",
            });
        }

        // Update the status to true (admin accepted) for all user applications
        const update = await apply.findByIdAndUpdate(id, { status: true });

        if (update) {
            res.status(200).json({
                success: true,
                message: "Admin accepted  applications",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Admin status update failed",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});




//get the all application from internid
router.get('/applications/:id', async (req: Request, res: Response, next: NextFunction) => {
    const internid = req.params.id
    try {
        const checkid = await jobs.findById(internid);
        if (!checkid) {
            res.status(404).json({
                success: false,
                message: "no internship found in this id"
            })
        }
        const application = await apply.findOne({ intern: internid })
        if (application) {
            res.status(200).json({
                success: true,
                user: application
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
})



module.exports = router