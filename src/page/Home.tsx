import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Device = {
  id: number;
  name: string;
  imei: string;
  type: number;
  lastUpdate: string | null;
  lastValue: string | null;
  extension: string | null;
  environment: {
    name: string;
    code: string;
    unit: {
      id: number;
      name: string;
      unit: string;
    };
  } | null;
};

type ContainerSetting = {
  id: number;
  name: string;
  value: string | number | boolean;
  type: string;
};

type Container = {
  id: number;
  name: string;
  address: string;
  localtion: string | null;
  devices: Device[];
  color: string | null;
  type: number;
  settings: ContainerSetting[];
};

type ApiResponse = {
  message: string;
  code: number;
  datas: Container[];
};

const Home = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<Container[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
  
    fetch("https://sonorx.soil.mn/v1/api/container", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: ApiResponse) => {
        if (data.datas && Array.isArray(data.datas)) {
          setContainers(data.datas);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Failed to load containers");
      });
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-8">
      <div className="container mx-auto max-w-6xl">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex justify-between items-center border-b">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Dashboard
            </CardTitle>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Logout
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : containers.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary">
                  Container-н Мэдээлэл
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {containers.map((container) => (
                    <div
                      key={container.id}
                      className="p-4 bg-muted/50 rounded-lg border border-muted hover:shadow-md transition-all"
                      style={container.color ? { borderLeft: `4px solid ${container.color}` } : {}}
                    >
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold">{container.name}</h3>
                        <p className="text-sm text-muted-foreground">{container.address}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p><span className="font-medium">ID:</span> {container.id}</p>
                        <p><span className="font-medium">Type:</span> {container.type}</p>
                        
                        {container.devices && container.devices.length > 0 && (
                          <div className="mt-3">
                            <p className="font-medium mb-2">Devices ({container.devices.length}):</p>
                            <div className="pl-3 border-l-2 border-primary/30 space-y-2">
                              {container.devices.map(device => (
                                <div key={device.id} className="text-sm">
                                  <p className="font-medium">{device.name}</p>
                                  <p className="text-xs text-muted-foreground">IMEI: {device.imei}</p>
                                  {device.environment && (
                                    <p className="text-xs">
                                      {device.environment.name}: {device.environment.unit?.unit}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Мэдээлэл байхгүй байна.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
