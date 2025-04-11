import type { Theme, SxProps } from "@mui/material/styles";
import { Box } from "@mui/material";
// import { Markdown } from "../../components/markdown";
import Markdown from "react-markdown";
// ----------------------------------------------------------------------

type Props = {
  description?: string;
  sx?: SxProps<Theme>;
};

export function ProductDetailsDescription({ description, sx }: Props) {
  return (
    <Box sx={{ p: 3 }}>
      <Markdown
        children={description}
        // sx={[
        //   () => ({
        //     p: 3,
        //     "& p, li, ol, table": { typography: "body2" },
        //     "& table": {
        //       mt: 2,
        //       maxWidth: 640,
        //       "& td": { px: 2 },
        //       "& td:first-of-type": { color: "text.secondary" },
        //       "tbody tr:nth-of-type(odd)": { bgcolor: "transparent" },
        //     },
        //   }),
        //   ...(Array.isArray(sx) ? sx : [sx]),
        // ]}
      />
    </Box>
  );
}
