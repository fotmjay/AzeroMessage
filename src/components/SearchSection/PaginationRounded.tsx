import { Stack, Pagination } from "@mui/material";
import { SetStateAction } from "react";

type Props = {
  onChange: React.Dispatch<SetStateAction<number>>;
  currentPage: number;
  maxNumberOfPages: number;
};

export default function PaginationRounded(props: Props) {
  const handleChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    props.onChange(value);
  };

  return (
    <Stack spacing={1}>
      <Pagination
        onChange={handleChange}
        page={props.currentPage}
        count={props.maxNumberOfPages}
        variant="outlined"
        shape="rounded"
      />
    </Stack>
  );
}
