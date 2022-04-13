import Joi from "joi";
import CompaniesDAO from "../dao/companiesDAO.js";
import Schemas from "../schemas/joi.schemas.js";

export default class CompaniesController {

    // * CRUD methods
    //Gets all non deleted companies with optional filters from query parameters
    static async apiGetCompanies (req,res,next) {
        try {
            const companiesPerPage = req.query.companiesPerPage ? parseInt(req.query.companiesPerPage, 10) : 20;
            const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    
            let filters = {};
            if (req.query.razon_social) {
                filters.razon_social = req.query.razon_social;
            } else if (req.query.location) {
                filters.location = req.query.location;
            } else if (req.query.name){
                filters.name = req.query.name;
            }
    
            const {companiesList, totalNumCompanies} = await CompaniesDAO.getAllCompanies( {
                filters,
                page,
                companiesPerPage
            });
    
            let response = {
                companies: companiesList,
                page: page,
                filters: filters,
                entries_per_page: companiesPerPage,
                total_results: totalNumCompanies,
            }
            res.json(response)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Registers a new company to the database
    static async apiPostCompanies (req,res,next) {
        try {
            let company = await CompaniesDAO.checkCompanyExistence(req.body.name);

            if(company) {
                res.status(400).json({ error: "Company already exists"})
                return;
            }

            const companyInfo = {
                name: req.body.name,
                location: req.body.location,
                razon_social: req.body.razon_social,
                deleted: false
            }

            Joi.assert(companyInfo,Schemas.companySchema);
            const CompanyID = await CompaniesDAO.getCompanyID();

            companyInfo.company_id = CompanyID.value.count;
            companyInfo.createdAt = new Date();
            companyInfo.updatedAt = new Date();
            const companyResponse = await CompaniesDAO.addCompany(
                companyInfo
            )
            res.json({ status:"success"})

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Updates a company found by email and password
    static async apiUpdateCompanies (req,res,next) {
        try {         
            const companyInfo = {
                name: req.body.name,
                location: req.body.location,
                razon_social: req.body.razon_social,
            }

            Joi.assert(companyInfo,Schemas.companySchema);
            companyInfo.updatedAt = new Date();

            const CompanyResponse = await CompaniesDAO.updateCompany(
                companyInfo
            )
            var { error } = CompanyResponse;
            if (error) {
                res.status(400).json({ error });
            }
            if (CompanyResponse.matchedCount == 0) {
                res.status(400).json({ error: "Company not found with provided name" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Soft deletes a company found by email and password
    static async apiDeleteCompanies (req,res,next) {
        try {
            const companyInfo = {
                name: req.body.name,
                razon_social: req.body.razon_social,
            }
            Joi.assert(companyInfo,Schemas.deleteCompanySchema);

            const CompanyResponse = await CompaniesDAO.deleteCompany(
                companyInfo
            )

            if (CompanyResponse.matchedCount == 0) {
                res.status(400).json({ error: "Company not found with name and razon_social: provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }


    //* Specific methods
    //Gets a company by its name
    static async apiGetCompanyByName(req,res,next) {
        try {
            let name = req.body.name;
            let company = await CompaniesDAO.checkCompanyExistence(name);
            if(!company) {
                res.status(400).json({ error: "Company does not exists"})
                return;
            }

            res.json(company)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }

    //Gets users in company
    static async apiGetUsersByCompany(req,res,next) {
        try {
            let name = req.body.name;
            let company = await CompaniesDAO.getUsersByCompany(name);
            if(!company) {
                res.status(400).json({ error: "Company does not exists"})
                return;
            }

            res.json(company)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }

    //Gets devices in company
    static async apiGetDeviceByCompany(req,res,next) {
        try {
            let name = req.body.name;
            let company = await CompaniesDAO.getDevicesByCompany(name);
            if(!company) {
                res.status(400).json({ error: "Company does not exists"})
                return;
            }

            res.json(company)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }

    //Gets devices in company
    static async apiGetDeviceAndRecordByCompany(req,res,next) {
        try {
            let name = req.body.name;
            let company = await CompaniesDAO.getDevicesAndRecordByCompany(name);
            if(!company) {
                res.status(400).json({ error: "Company does not exists"})
                return;
            }

            res.json(company)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }

    //Generates company ID
    static async apiGetID(req,res,next) {
        try {
            const CompanyResponse = await CompaniesDAO.getCompanyID();
            res.json(CompanyResponse)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }
}