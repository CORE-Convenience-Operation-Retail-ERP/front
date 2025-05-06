import { Autocomplete, TextField, Avatar, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchPartTimers } from "../../../service/store/partTimerService";

function PartTimerSelector({ onSelect }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchPartTimers({ page: 0, size: 100, partStatus: 1 });
      setOptions(res.content);
    };
    load();
  }, []);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.partName}
      onChange={(e, value) => onSelect(value)}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Avatar
            src={option.partImg}
            alt={option.partName}
            sx={{ width: 30, height: 30, marginRight: 1 }}
          />
          {option.partName}
        </Box>
      )}
      renderInput={(params) => <TextField {...params} label="아르바이트 선택" />}
    />
  );
}

export default PartTimerSelector;