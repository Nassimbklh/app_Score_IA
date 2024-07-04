import React, { useEffect, useState } from "react";
import Select from "react-select";


const TeamSelect = ({ teams, value, onChange, required }) => {
  const options = teams.map((team) => {
    return {
      value: team.name,
      image: team.image,
      label: team.name,
    };
  });
  const handleChange = (item) => {
    onChange(item.value);
  };

  return (
    <Select
      styles={{
        control: (base, state) => ({
          ...base,
          width: "215px",
        }),
      }}
      options={options}
      required={required}
      placeholder="Team"
      openMenuOnClick={true}
      value={options.find((option) => option.value === value)}
      onChange={handleChange}
      formatOptionLabel={(option) => (
        <div
          style={{
            display: "flex",
            "align-items": "center",
            gap: "3px",
          }}
        >
          <img src={option.image} alt={option.label} width="30" height="30" />
          <span>{option.label}</span>
        </div>
      )}
      isSearchable={false}
    />
  );
};

export default TeamSelect;