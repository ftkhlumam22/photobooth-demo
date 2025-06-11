import { useSpecialEvent } from "../../features/specialEvents/hooks/useSpecialEvent";
import JaehyunEvent from "../../features/specialEvents/components/JaehyunEvent";

const specialEvents = [
  {
    id: "jaehyun",
    name: "Photo with Jaehyun",
    component: JaehyunEvent,
  },
  // Add more special events here in the future
];

const SpecialEventSelector = () => {
  const { events, activeEvent, setActiveEvent } =
    useSpecialEvent(specialEvents);

  return (
    <div className="special-event-selector">
      <h3 className="text-lg font-medium mb-3">Special Events</h3>

      {activeEvent ? (
        <div>
          <button
            onClick={() => setActiveEvent(null)}
            className="mb-4 text-blue-500 hover:underline flex items-center"
          >
            <span>← Back to events</span>
          </button>
          <activeEvent.component />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {events.map((event) => (
            <button
              key={event.id}
              className="p-3 bg-gray-200 hover:bg-gray-300 rounded text-left flex justify-between items-center"
              onClick={() => setActiveEvent(event)}
            >
              <span className="font-medium">{event.name}</span>
              <span className="text-blue-500">➔</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialEventSelector;
