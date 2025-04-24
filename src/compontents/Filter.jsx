import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiSearch } from "react-icons/fi";

const Filter = () => {
    const categories = [
        { categoryId: 1, categoryName: "Electronics" },
        { categoryId: 2, categoryName: "Clothing" },
        { categoryId: 3, categoryName: "Furniture" },
    ];

    const [category, setCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleClearFilters = () => {
        setCategory("all");
        setSearchTerm("");
        setSortOrder("asc");
    };

    return (
        <div className="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4">
            <div className="relative flex items-center 2xl:w-[450px] sm:w-[420px] w-full">
                <input 
                    type="text"
                    placeholder="Search Products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-400 text-slate-800 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-[#1976d2]" />
                <FiSearch className="absolute left-3 text-slate-800" size={20} />
            </div>

            <div className="flex sm:flex-row flex-col gap-4 items-center">
                <FormControl variant="outlined" size="small" className="min-w-[120px]">
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        value={category}
                        onChange={handleCategoryChange}
                        label="Category"
                        className="text-slate-800"
                    >
                        <MenuItem value="all">All</MenuItem>
                        {categories.map((item) => (
                            <MenuItem key={item.categoryId} value={item.categoryName}>
                                {item.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Tooltip title={`Sorted by price: ${sortOrder}`}>
                    <Button
                        variant="contained"
                        onClick={toggleSortOrder}
                        color="primary"
                        className="flex items-center gap-2 h-10"
                    >
                        Sort By
                        {sortOrder === "asc" ? <FiArrowUp size={20} /> : <FiArrowDown size={20} />}
                    </Button>
                </Tooltip>

                <button 
                    className="flex items-center gap-2 bg-rose-900 text-white px-3 py-2 rounded-md transition duration-300 ease-in shadow-md focus:outline-none"
                    onClick={handleClearFilters}
                >
                    <FiRefreshCw className="font-semibold" size={16} />
                    <span className="font-semibold">Clear Filter</span>
                </button>
            </div>
        </div>
    );
};

export default Filter;
