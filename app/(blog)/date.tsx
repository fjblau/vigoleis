import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function DateComponent({ dateString }: { dateString: string }) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), "d. MMMM yyyy", { locale: de })}
    </time>
  );
}
