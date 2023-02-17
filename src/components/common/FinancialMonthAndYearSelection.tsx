import styled from '@emotion/styled';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { BoxProps } from '@mui/system';
import React, { useEffect } from 'react';
import { AppContext } from '../../App';
import { getCurrentYearAndMonth } from '../../utils/commonfunction';
import { FinancialPeriod } from '../../utils/types';

const StyledField = styled(Box)<BoxProps>(() => ({
    padding: '20px',
    display: 'flex'
}));
interface FinancialMonthAndYearSelectionProps {
    distinctPeriods: FinancialPeriod[];
    setSelected: any;
}

export default function FinancialMonthAndYearSelection(props: FinancialMonthAndYearSelectionProps) {
    const { distinctPeriods, setSelected } = props
    const appContext = React.useContext(AppContext);
    const { state, dispatch } = appContext;
    const { selectedFinancialPeriod } = state;

    useEffect(() => {
        dispatch({ "type": "setFinancialPeriod", value: getCurrentYearAndMonth() || null });
    }, [dispatch])

    const handleSelectYearAndMonth = (event: React.ChangeEvent<{}>, YearAndMonth: FinancialPeriod | null) => {
        setSelected([]);
        dispatch({ "type": "setFinancialPeriod", value: YearAndMonth || null });
    }

    return (
        <React.Fragment>
            <StyledField>
                <Autocomplete
                    value={selectedFinancialPeriod}
                    disabled={false}
                    id="base-map"
                    options={distinctPeriods}
                    isOptionEqualToValue={(option, value) => option.title === value.title}
                    sx={{ width: 250 }}
                    getOptionLabel={(option) => `${option.title}`}
                    onChange={(event, values) => handleSelectYearAndMonth(event, values)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"Year"}
                            placeholder={"Year"}
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />

            </StyledField>
        </React.Fragment>
    )
}