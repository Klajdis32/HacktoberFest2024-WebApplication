import "./register.css";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../../context/AuthContext.js';

const Register = () => {
        const { 
            registerUser,
            registerError,
            registerLoading,
            registerSuccess,
            success,
            toerror
        } = useContext(AuthContext);

        const [formData, setFormData] = useState({
            name: "",
            lastName: "",
            gitlabId: "",
            kaggleId: "",
            gender: "",
            dateofbirth: "",  
            bio: "",
            intersts: ""
        });
    
        const [frontError, setFrontError] = useState(""); 
        const [selectedInterests, setSelectedInterests] = useState([]);

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        };
    
        const handleInterestChange = (e) => {
            const { value, checked } = e.target;
            if (checked) {
                setSelectedInterests((prev) => [...prev, value]); 
            } else {
                setSelectedInterests((prev) => prev.filter((interest) => interest !== value)); 
            }
        };
 

        const validateForm = () => {
            if (!formData.name || !formData.lastName || !formData.gitlabId || !formData.kaggleId) {
                setFrontError("Please fill all required fields!");
                return false; 
            }

            if (formData.name && formData.name.length > 50) {
                setFrontError("Name must be less than 50 characters!");
                return false;
            }

            if (formData.lastName && formData.lastName.length > 50) {
                setFrontError("LastName must be less than 50 characters!");
                return false;
            }

            if (formData.bio && formData.bio.length > 2000) {
                setFrontError("Bio must be less than 2000 characters!");
                return false;
            }

            setFrontError(""); 
            return true;
        };

        const handleSubmit = async (e) => { 
            e.preventDefault();
        
            if (!validateForm()) {
                return;
            }
        
            const interestsString = selectedInterests.join(',');
        
            const formDataWithInterests = {
                ...formData,
                interests: interestsString
            };

            console.log(formDataWithInterests);
        
            try {
                await registerUser(formDataWithInterests);
                
            } catch (err) {
                return;
            }
        
        };
        
        useEffect(() => {
            if (success) {
                setFormData({
                    name: "",
                    lastName: "",
                    gitlabId: "",
                    kaggleId: "",
                    gender: "",
                    dateofbirth: "",
                    bio: "",
                    interests: ""
                });
            }
        }, [success]);

    return (
        <div className="Register">
        
                <div className="Regtext">
                    <h1> <span id="togt">&gt;</span>Register Here</h1>
                    <h2>Welcome to Hactoberfest 2024 <br/>Fill in your information in order to register</h2>
                </div>
                
          
                <form onSubmit={handleSubmit} className="form-container">
                    
                <div className="form-group1">
                    <div className="FirstInput">
                        <label htmlFor="name">Name *</label><br/><br/>
                        <input
                            type="text"
                            id="name"
                            placeholder="> enter your name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ border: !formData.name && frontError ? "2px solid red" : "1px solid #ccc" }} 
                        />
                    </div>

                    <div className="SecondInput">
                        <label htmlFor="lastName">Last name *</label><br/><br/>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="> enter your last name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            style={{ border: !formData.lastName && frontError ? "2px solid red" : "1px solid #ccc" }}
                        />
                    </div>
                </div>

                <div className="form-group1">
                    <div className="FirstInput">
                        <label htmlFor="gitlabId">Gitlab ID *</label><br/><br/>
                        <input
                            type="text"
                            id="gitlabId"
                            placeholder="> enter your gitlab id"
                            name="gitlabId"
                            value={formData.gitlabId}
                            onChange={handleChange}
                            style={{ border: !formData.gitlabId && frontError ? "2px solid red" : "1px solid #ccc" }}
                        />
                    </div>

                    <div className="SecondInput">
                        <label htmlFor="kaggleId">Kaggle ID *</label><br/><br/>
                        <input
                            type="text"
                            id="kaggleId"
                            placeholder="> enter your kaggle id"
                            name="kaggleId"
                            value={formData.kaggleId}
                            onChange={handleChange}
                            style={{ border: !formData.kaggleId && frontError ? "2px solid red" : "1px solid #ccc" }}
                        />
                    </div>
                </div>

                        <div className="form-group1">
                            <div className="FirstInput">
                                <label htmlFor="gender">Gender</label><br/><br/>
                                <select
                                    id="gender"
                                    name="gender"
                                    placeholder="select a gender"
                                    value={formData.gender}  
                                    onChange={handleChange}  
                                >
                                    <option value="">select a gender</option> 
                                    <option value="male">male</option>
                                    <option value="female">female</option>
                                    <option value="non-binary">non-binary</option>
                                    <option value="other">other</option>
                                </select>
                            </div>

                            <div className="SecondInput">
                                <label htmlFor="dateofbirth">Date of birth</label><br/><br/>
                                <input
                                    type="date"
                                    id="dateofbirth"
                                    name="dateofbirth"
                                    value={formData.dateofbirth}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="aboutTextarea">
                            <label htmlFor="bio">About you</label><br/><br/>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio} 
                                    onChange={handleChange} 
                                    rows="5" 
                                    placeholder="> write your bio"
                                />
                        </div>

                        <div className="interestsdiv">
                            <label htmlFor="interests">What are you interested in</label><br/><br/>
                            
                            <div className="checkbox-container">
                                <div>
                                    <input type="checkbox" className="checkbox" id="ai" name="interests" value="ai" onChange={handleInterestChange} />
                                    <label htmlFor="ai">ai</label>
                                </div>
                                <div>
                                    <input type="checkbox" className="checkbox" id="backend" name="interests" value="backend" onChange={handleInterestChange} />
                                    <label htmlFor="backend">backend</label>
                                </div>

                                <div>
                                    <input type="checkbox" className="checkbox" id="ml" name="interests" value="ml" onChange={handleInterestChange} />
                                    <label htmlFor="ml">ml</label>
                                </div>
                                <div>
                                    <input type="checkbox" className="checkbox" id="fullstack" name="interests" value="fullstack" onChange={handleInterestChange} />
                                    <label htmlFor="fullstack">fullstack</label>
                                </div>
                                <div>
                                    <input type="checkbox" className="checkbox" id="frontend" name="interests" value="frontend" onChange={handleInterestChange} />
                                    <label htmlFor="frontend">frontend</label>
                                </div>
                            </div>
                        </div>          
            
                        {(frontError || registerError || registerSuccess) && (
                            <div
                                id={
                                    frontError ? "low" 
                                    :
                                    success ? "success"
                                    :
                                    toerror ? "high" 
                                    : ""
                                }
                                className="error-message"
                            >
                                     {frontError || registerSuccess?.message || registerError?.message}
                            </div>
                        )}

                        <div className="buttondiv">
                            <button 
                                variant="primary"
                                className="tobutton" 
                                type="submit"
                                disabled={registerLoading}
                            >
                                       {registerLoading ? "REGISTERING... " : "SUBMIT"}
                            </button>
                            <br/><br/>
                        </div>
                </form>
        
     
        </div>
    );
}
 
export default Register; 