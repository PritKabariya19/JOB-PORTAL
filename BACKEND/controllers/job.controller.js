import { Job } from "../models/job.model.js";

// Admin posts a job
export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobtype,          // schema field
            experienceLevel,  // schema field
            position,
            companyId
        } = req.body;

        const userId = req.id; // from auth middleware

        // Validate required fields
        if (!title || !description || !requirements || !salary || !location || !jobtype || !experienceLevel || !position || !companyId) {
            return res.status(400).json({
                message: "All required fields must be provided.",
                success: false
            });
        }

        // Create job
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(r => r.trim()),
            salary: Number(salary),
            location,
            jobtype,
            experienceLevel,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Student: get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query)
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Student: get job by id
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate("company")
            .populate("application");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Admin: get jobs posted by admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({ jobs, success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
