import { useEffect, useState } from 'react';
import mystyle from '../liveGroups.module.css';
import { MdGroups } from 'react-icons/md';
import { api } from '@/api/axios';

function LiveGroups() {
  const [airNum, setAirNum] = useState(0);
  const [railNum, setRailNum] = useState(0);
  const [taxiNum, setTaxiNum] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('groups/live');
        if (Array.isArray(res.data)) {
          res.data.forEach((element) => {
            if (element._id == 'Taxi') {
              setTaxiNum(element.count);
            }
            if (element._id == 'Railway') {
              setRailNum(element.count);
            }
            if (element._id == 'Airplane') {
              setAirNum(element.count);
            }
          });
        }
      } catch {}
    })();
  });


  return (
    <div className={mystyle.liveGroupsWrapper}>
      <div className={mystyle.liveGroupsTitle}>
        Find cotravellers from your college to anywhere
      </div>
      <div className={mystyle.liveGroups}>
        <LiveGroup mode="Airplane" num={airNum} />
        <LiveGroup mode="Train" num={railNum} />
        <LiveGroup mode="Taxi" num={taxiNum} />
      </div>
    </div>
  );
}

export default LiveGroups;

type LivebxProps = {
  mode: string;
  num: number;
};

function LiveGroup({ mode, num }: LivebxProps) {
  return (
    <div className={mystyle.liveGroupWrapper}>
      <div className={mystyle.liveGroupHeading}>
        <MdGroups size="28px" />
        Live {mode} Groups
      </div>
      <div className={mystyle.liveGroupMetrics}>{num}</div>
    </div>
  );
}
