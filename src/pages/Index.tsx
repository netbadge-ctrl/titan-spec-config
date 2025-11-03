import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Cpu, HardDrive, Database, Zap, Network, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            IDC 硬件管理系统
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            专业的数据中心硬件性能指标配置与管理平台
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/hardware-requirements")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            进入管理系统
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Cpu,
              title: "CPU 管理",
              description: "配置处理器性能指标，包括核心数、频率等参数",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Database,
              title: "内存管理",
              description: "设置内存容量、速度、DDR类型等要求",
              color: "from-emerald-500 to-teal-500",
            },
            {
              icon: Network,
              title: "网卡管理",
              description: "管理网络接口带宽、类型、端口配置",
              color: "from-violet-500 to-purple-500",
            },
            {
              icon: HardDrive,
              title: "存储管理",
              description: "配置 HDD/SSD/NVME 存储性能指标",
              color: "from-orange-500 to-amber-500",
            },
            {
              icon: Zap,
              title: "GPU 管理",
              description: "设置显卡显存、带宽等性能要求",
              color: "from-rose-500 to-pink-500",
            },
            {
              icon: Server,
              title: "RAID 管理",
              description: "配置 RAID 卡类型、缓存等参数",
              color: "from-cyan-500 to-blue-500",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-medium)] hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-card/50"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto border-2 border-primary/20 shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle className="text-2xl">开始配置硬件性能指标</CardTitle>
              <CardDescription className="text-base">
                为您的客户设置服务器硬件最低性能要求，确保IDC项目交付质量
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/hardware-requirements")}
                size="lg"
                className="w-full md:w-auto"
              >
                立即开始
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
